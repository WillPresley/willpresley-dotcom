require 'digest'

module Jekyll
    module GetFileHash
        def sha512(input)
            fixed_input = input.to_s
            file_path = Pathname.new(fixed_input)
            Digest::SHA512.base64digest File.read file_path
        end

        def sha384(input)
            fixed_input = input.to_s
            file_path = Pathname.new(fixed_input)
            Digest::SHA384.base64digest File.read file_path
        end

        def sha256(input)
            fixed_input = input.to_s
            file_path = Pathname.new(fixed_input)
            Digest::SHA256.base64digest File.read file_path
        end
    end

    module GetTextHash
        def sha512text(input)
            fixed_input = input.to_s
            Digest::SHA512.base64digest fixed_input.strip
        end

        def sha384text(input)
            fixed_input = input.to_s
            Digest::SHA384.base64digest fixed_input.strip
        end

        def sha256text(input)
            fixed_input = input.to_s
            Digest::SHA256.base64digest fixed_input.strip
        end
    end
end

Liquid::Template.register_filter(Jekyll::GetFileHash)
Liquid::Template.register_filter(Jekyll::GetTextHash)
